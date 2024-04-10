import os
import cv2
import boto3
import requests
import mysql.connector
import face_recognition
import numpy as np
from mysql.connector import Error
from botocore.client import Config
from dotenv import load_dotenv
import time
import datetime
import requests


load_dotenv()

bucket_name = os.getenv("BUCKET_NAME")
bucket_region = os.getenv("BUCKET_REGION")
access_key = os.getenv("ACCESS_KEY")
secret_access_key = os.getenv("SECRET_ACCESS_KEY")


s3 = boto3.client(
    "s3",
    region_name=bucket_region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_access_key,
    config=Config(signature_version="s3v4"),
)


def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='VisitorManagementSystem',
            user='root',
            password='c7r10m10[]'
        )

        return connection

    except Error as e:
        print(f"Error: {e}")


def generate_url(connection, userID):
    if connection.is_connected():
            cursor = connection.cursor()
            query = (f"SELECT * FROM Users where UserID = '{userID}';")
            cursor.execute(query)

            row = cursor.fetchall()
            object_key = row[0][4]

            url = s3.generate_presigned_url("get_object", Params={"Bucket": bucket_name, "Key": object_key}, ExpiresIn=3600)
            return url


def save_image(url, save_path):
    response = requests.get(url)
    
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)


def download_students(connection, save_path):
    student_names = []
    if connection.is_connected():
        cursor = connection.cursor()
        query = ("SELECT name, image from users where usertype = 'student'")
        cursor.execute(query)

        row = cursor.fetchall()

        for name, text in row:
            student_names.append(name)
            url = s3.generate_presigned_url("get_object", Params={"Bucket": bucket_name, "Key": text}, ExpiresIn=3600)
            response = requests.get(url)
            if response.status_code == 200:
                with open(str(save_path + f"\\{name}.jpg"), 'wb') as f:
                    f.write(response.content)
    
    return student_names


def markAttendance(connection, name, students):
    cursor = connection.cursor()
    query = f"SELECT userid from users where name = '{name}';"
    cursor.execute(query)
    data = cursor.fetchall()
    if(len(data) > 0):
        userid = data[0][0]

        query = f"select rollnumber, branchofstudy from students where userid = {userid}"
        cursor.execute(query)
        temp = cursor.fetchall()
        if(len(temp) > 0):
            rollnumber = temp[0][0]
            branch = temp[0][1]

            with open("D:\\IIIT Delhi\\6th Semester\\Courses\\IP\\RIISE\\Attendance.csv", 'r+') as f:
                data = f.readlines()
                nameList = []

                # print(data)
                for line in data:
                    entry = line.split(',')
                    nameList.append(entry[0])

                if name not in nameList and name in students:
                    now = datetime.datetime.now()
                    timeString = now.strftime('%H:%M:%S')
                    f.writelines(f"\n{name},{rollnumber},{branch},{timeString}")


def find_encoding(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)

    return encodeList



def send_to_server(username):
    server_url = 'http://localhost:8080/scannedFace'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    popup_data = {"scannedFace": username}

    response = requests.post(server_url, headers=headers, data=popup_data)



path = "D:\\IIIT Delhi\\6th Semester\\Courses\\IP\\RIISE\\Meetings"
meeting_time = 30
wait_time = 60


while True:
    connection = connect_to_database()
    students = download_students(connection, path)
    cursor = connection.cursor()
    query = "SELECT * FROM meetings;"
    cursor.execute(query)
    data = cursor.fetchall()
    
    for entry in data:
        userid = entry[2]
        name = entry[8]
        url = generate_url(connection, userid)
        save_image(url, str(path + f"\\{name}.jpg"))

        added_time = datetime.timedelta(minutes=meeting_time)
        table_datetime = datetime.datetime.combine(entry[4], datetime.time()) + (entry[5] + added_time)
        current_datetime = datetime.datetime.now()

        if(current_datetime > table_datetime):
            # if name not in students:
            os.remove(str(path + f"\\{name}.jpg"))

    images = []
    image_names = []
    directory = os.listdir(path)
    
    for img in directory:
        currImage = cv2.imread(f'{path}/{img}')
        images.append(currImage)
        image_names.append(os.path.splitext(img)[0])

    encoded_list = find_encoding(images)
    cap = cv2.VideoCapture(0)

    start_time = time.time()
    sent_usernames = {}
    while True:
        success, img = cap.read()
        imgR = cv2.resize(img, (0, 0), None, 0.25, 0.25)
        imgR = cv2.cvtColor(imgR, cv2.COLOR_BGR2RGB)

        currFrameFaces = face_recognition.face_locations(imgR)
        currFrameEncodes = face_recognition.face_encodings(imgR, currFrameFaces)

        for faceLoc, encodeFace in zip(currFrameFaces, currFrameEncodes):
            matches = face_recognition.compare_faces(encoded_list, encodeFace)
            faceDistance = face_recognition.face_distance(encoded_list, encodeFace)
            matchIndex = np.argmin(faceDistance)

            if matches[matchIndex]: 
                name = image_names[matchIndex]

                query = f"select username from users where name = '{name}';"
                cursor.execute(query)
                data = cursor.fetchall()
                if len(data) > 0:
                    username = data[0][0]
                    if username not in sent_usernames.keys():
                        sent_usernames[username] = 0
                    if sent_usernames[username] == 0:
                        sent_usernames[username] += 1
                        send_to_server(username)

                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                cv2.putText(img, name.upper(), (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 0.6, (255, 255, 255))
                markAttendance(connection, name, students)

        cv2.namedWindow("Webcam", cv2.WND_PROP_FULLSCREEN)
        cv2.setWindowProperty("Webcam", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
        cv2.imshow("Webcam", img)
        key = cv2.waitKey(1)

        if time.time() > start_time + wait_time:
            break
