from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pymysql
from konlpy.tag import Okt
from collections import Counter
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI()

# DB 연결 설정
conn = pymysql.connect(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    db=os.getenv("DB_NAME"),
    charset='utf8mb4',
    autocommit=True
)
cursor = conn.cursor()

# 형태소 분석기 및 불용어
okt = Okt()
stopwords = set([
    '은', '는', '이', '가', '을', '를', '의', '에', '에서', '으로', '와', '과', '요', '못', '번', '곳', '것', '너무', '아주',
    '한', '또는', '그리고', '하지만', '때문에',
    '좋다', '괜찮다', '있다', '없다', '하다', '되다', '나다', '주다', '받다', '싶다', '진짜', '또',
])

class StoreKeywordRequest(BaseModel):
    store_id: int

def extract_top_keywords(texts, top_n=5):
    nouns = []
    for text in texts:
        nouns.extend([n for n in okt.nouns(text) if len(n) > 1 and n not in stopwords])
    return Counter(nouns).most_common(top_n)

def insert_keywords(store_id, keyword_list):
    cursor.execute("DELETE FROM store_keyword WHERE store_id = %s", (store_id,))
    for keyword, freq in keyword_list:
        cursor.execute(
            """
            INSERT INTO store_keyword (store_id, keyword, frequency)
            VALUES (%s, %s, %s)
            """,
            (store_id, keyword, freq)
        )

@app.post("/keyword/extract")
def extract_keywords(request: StoreKeywordRequest):
    store_id = request.store_id

    cursor.execute("SELECT comment FROM store_review WHERE store_id = %s", (store_id,))
    reviews = [row[0] for row in cursor.fetchall()]

    keyword_list = extract_top_keywords(reviews, top_n=5)
    insert_keywords(store_id, keyword_list)

    return {"message": f"Store {store_id} 키워드 {len(keyword_list)}개 추출 완료"}