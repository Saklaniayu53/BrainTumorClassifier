import numpy as np
from PIL import Image

IMAGE_SIZE = (224, 224)

def preprocess_image(image_path):
    # Open image using Pillow
    image = Image.open(image_path)

    # Convert to RGB (important for grayscale images)
    image = image.convert("RGB")

    # Resize
    image = image.resize(IMAGE_SIZE)

    # Convert to numpy array
    image = np.array(image, dtype=np.float32)

    # Normalize
    image = image / 255.0

    # Add batch dimension
    image = np.expand_dims(image, axis=0)

    return image