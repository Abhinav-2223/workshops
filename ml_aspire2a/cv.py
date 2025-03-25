#
# NTUHPC Workshop
# ML on Aspire2A Workshop
# OpenCV Model Test Script
#

import sys
import cv2
from ultralytics import YOLO

# parse model path from command line args
if len(sys.argv) <= 1:
    print("Usage: cv.py rps_model.pt")
    sys.exit(1)

model = YOLO(sys.argv[1])

# open webcam
webcam = cv2.VideoCapture(0)
while webcam.isOpened():
    # read 1 frame from webcam
    ret, frame = webcam.read()
    if not ret:
        break

    # run inference on frame from webcam
    results = model(frame)

    # show image with OpenCV
    annotated_frame = results[0].plot()
    cv2.imshow("YOLOv8 Detection", annotated_frame)

    # exit when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

webcam.release()
cv2.destroyAllWindows()
