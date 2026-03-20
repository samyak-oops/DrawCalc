from pydantic import BaseModel

class ImageData(BaseModel):
    image: str  # Base64-encoded image data
    dict_of_vars: dict  # Dictionary of user-assigned variables