import io, os, json, tempfile
from google.cloud import storage
from PIL import Image
import torch
import torchvision.transforms as T
import numpy as np

# — configuration —
BUCKET_NAME    = "my-bird-models-bucket"
MODEL_FILE     = "model_scripted.pt"
CLASSES_FILE   = "classes.json"
IMG_SIZE       = 224

NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD  = [0.229, 0.224, 0.225]

_model   = None
_classes = None
_transform = None

def _load_artifacts():
    global _model, _classes, _transform
    if _model is not None:
        return

    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)


    blob = bucket.blob(MODEL_FILE)
    _, mpath = tempfile.mkstemp(suffix=".pt")
    blob.download_to_filename(mpath)
    _model = torch.jit.load(mpath, map_location="cpu").eval()

    blob = bucket.blob(CLASSES_FILE)
    _, cpath = tempfile.mkstemp(suffix=".json")
    blob.download_to_filename(cpath)
    with open(cpath, "r") as f:
        _classes = json.load(f)


    _transform = T.Compose([
        T.Resize(IMG_SIZE),
        T.CenterCrop(IMG_SIZE),
        T.ToTensor(),
        T.Normalize(NORMALIZE_MEAN, NORMALIZE_STD),
    ])

def predict(request):
    """
    HTTP Cloud Function entrypoint.
    Expects POST multipart/form-data with key "file" = image.
    Returns JSON: {"predicted_class":"...", "confidence":0.92}
    """

    # only POST
    if request.method != "POST":
        return ("Only POST allowed", 405)

    _load_artifacts()

    # get file
    if "file" not in request.files:
        return ("Missing form-data key 'file'", 400)
    f = request.files["file"]

    try:
        img = Image.open(io.BytesIO(f.read())).convert("RGB")
    except Exception:
        return ("Invalid image", 400)

    # preprocess & batch
    tensor = _transform(img).unsqueeze(0)  # [1,3,H,W]

    # inference
    with torch.no_grad():
        out = _model(tensor)                 # raw logits
        probs = torch.nn.functional.softmax(out, dim=1)[0]
        idx   = int(probs.argmax().item())
        conf  = float(probs[idx].item())
        label = _classes[idx]

    return (json.dumps({"predicted_class":label, "confidence":conf}),
            200,
            {"Content-Type":"application/json"})
