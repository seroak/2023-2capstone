from flask import Flask, request, jsonify

from body_25 import output_keypoints_with_lines, output_keypoints, image_printing
from werkzeug.utils import secure_filename
import fomula
import cv2
import base64
app = Flask(__name__)

# 계산식에 필요한 각 관절 좌표
side_shoulderx = side_earx = side_eyex = 0
front_Rshoulderx = front_Rshouldery = front_Rhipx = front_Rhipy = 0
front_Lshoulderx = front_Lshouldery = front_Lhipx = front_Lhipy = 0

# 진단 결과
turtleneck_result = scoliosis_result = 0

@app.route('/')
def index():
    return "Welcome to the index page!"

@app.route('/run', methods=["POST"])
def ai_run():
    print(request.files.get("front"))
    print(request.files.get("side"))
    print(request.files["front"])
    img=request.files["front"]
    img.save('./upload/front.png')
    BODY_PARTS_BODY_25 = {0: "Nose", 1: "Neck", 2: "RShoulder", 3: "RElbow", 4: "RWrist",
                        5: "LShoulder", 6: "LElbow", 7: "LWrist", 8: "MidHip", 9: "RHip",
                        10: "RKnee", 11: "RAnkle", 12: "LHip", 13: "LKnee", 14: "LAnkle",
                        15: "REye", 16: "LEye", 17: "REar", 18: "LEar", 19: "LBigToe",
                        20: "LSmallToe", 21: "LHeel", 22: "RBigToe", 23: "RSmallToe", 24: "RHeel", 25: "Background"}

    POSE_PAIRS_BODY_25 = [[0, 1], [0, 15], [0, 16], [1, 2], [1, 5], [1, 8], [8, 9], [8, 12], [9, 10], [12, 13], [2, 3],
                        [3, 4], [5, 6], [6, 7], [10, 11], [13, 14], [15, 17], [16, 18], [14, 21], [19, 21], [20, 21],
                        [11, 24], [22, 24], [23, 24]]

    # 신경 네트워크의 구조를 지정하는 prototxt 파일 (다양한 계층이 배열되는 방법 등)
    protoFile_body_25 = ".\\body_25\\pose_deploy.prototxt"

    # 훈련된 모델의 weight 를 저장하는 caffemodel 파일
    weightsFile_body_25 = ".\\body_25\\pose_iter_584000.caffemodel"

    # 이미지 경로
    sideman = ".\\Pictures\\side_good.png"
    frontman = ".\\Pictures\\scoliosis_test7.jpg"

    # frame_body_25 = cv2.imread(man)
    frame_side = cv2.imread(sideman)
    frame_front = cv2.imread(frontman)


    frame_SIDE = output_keypoints(frame=frame_side, proto_file=protoFile_body_25, weights_file=weightsFile_body_25,
                                threshold=0.2, model_name="BODY_25", BODY_PARTS=BODY_PARTS_BODY_25, picturetype = "side")
    turtleneck_result = fomula.turtleneck_fomula(earx=side_earx, shoulderx=side_shoulderx, eyex=side_eyex)          # 거북목 진단식
    image_printing(frame=frame_SIDE)
    print(f"turtleneck_result: {turtleneck_result}")

    frame_FRONT = output_keypoints(frame=frame_front, proto_file=protoFile_body_25, weights_file=weightsFile_body_25,
                                threshold=0.2, model_name="BODY_25", BODY_PARTS=BODY_PARTS_BODY_25, picturetype = "front")
    # 정면 사진 관절 라인
    frame_FRONT = output_keypoints_with_lines(frame=frame_FRONT, POSE_PAIRS=POSE_PAIRS_BODY_25)
    scoliosis_result = fomula.scoliosis_fomula(Lshouldery=front_Lshouldery, Rshouldery=front_Rshouldery, Lhipy=front_Lhipy, Rhipy=front_Rhipy)
    image_printing(frame=frame_FRONT)
    print(f"scoliosis_result: {scoliosis_result}")
    # output_keypoints_with_lines(frame=frame_BODY_25, POSE_PAIRS=POSE_PAIRS_BODY_25)


    image_path1 = ".\\download\\image.png"
    image_path2 = ".\\download\\front.png"
    variable_value= "value"
    with open(image_path1, 'rb') as img1_file:
        encoded_image1 = base64.b64encode(img1_file.read()).decode('utf-8')
    with open(image_path2, 'rb') as img2_file:
        encoded_image2 = base64.b64encode(img2_file.read()).decode('utf-8')
    value = "value"
    response_data = {
        'front': encoded_image1,
        'side' : encoded_image2,
        'value' : value
    }
    print("hi")
   

    return jsonify(response_data)