選択した県の市区町村shapeを地図上に描画、市区町村ごとの人口データに応じてshapeを色分け表示するサンプル。
以下、起動までの流れ

# データベース準備
アプリを動作させるにはバックエンドがアクセスするDBを準備する必要があります。PostgreSQL想定。
## 使用するファイル
### major_result_2020.xlsx
url https://www.e-stat.go.jp/stat-search/files?page=1&layout=datalist&toukei=00200521&tstat=000001049104&cycle=0&tclass1=000001049105&tclass2val=0

市区町村の人口。この例では、県・市区町村・人口（総人口・男女・15歳以下）列を切り出したcsvを作成して使用。
### N03-20240101.shp
url https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html#prefecture00

市区町村のshapeファイル。SQLファイルに変換してテーブルを作成する

※shapeファイルのsqlファイルへの変換

shp2pgsql -s 4612 -D -i -I N03-20240101.shp shape_municipality > N03-20240101.sql

## テーブル作成
### 1. 市町村人口テーブル
#### 1.1. テーブル作成
CREATE TABLE PrefectureMunicipality (
    PrefectureCode INT,
    PrefectureName VARCHAR(255),
    MunicipalityCode INT,
    MunicipalityName VARCHAR(255),
    TotalPopulation BIGINT,
    MalePopulation BIGINT,
    FemalePopulation BIGINT,
    PopulationUnder15 BIGINT,
);
#### 1.2. テーブルにcsv読み込み
COPY PrefectureMunicipality (
    PrefectureCode,
    PrefectureName,
    MunicipalityCode,
    MunicipalityName,
    TotalPopulation,
    MalePopulation,
    FemalePopulation,
    PopulationUnder15
)
FROM 'major_result_2020.csv' DELIMITER ',' CSV HEADER;

### 2. 市町村shapeテーブル
#### 2.1. sqlファイル読み込みでテーブル作成
psql -d (データベース名) -f N03-20240101.sql

# アプリ起動
## backend
cd backend

node index.js

（本番環境ではpm2などで起動する）
## mapapp
cd mapapp

nmp start

（本番環境ではnpm run buildして、build以下をwebサーバー上に置く）
