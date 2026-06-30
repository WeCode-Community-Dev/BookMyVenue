import os
from imagekitio import ImageKit

#initializing the imageKit instance
imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY")
)