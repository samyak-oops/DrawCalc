from fastapi import APIRouter
import base64
from io import BytesIO
from apps.calculator.utils import analyze_image
from schema import ImageData
from PIL import Image

router = APIRouter()

@router.post('') # Endpoint to receive image data and analyze it
async def run(data: ImageData): # Receive image data and variable dictionary from frontend
    image_data = base64.b64decode(data.image.split(',')[1])
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
    print('response from analyze_image:', responses)
    return{
        "message": "Image analyzed successfully",
        "type": "success",
        "data": responses
    }