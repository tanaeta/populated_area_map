-- post_officesテーブルの作成
CREATE TABLE post_offices (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL
    -- create_date DATE,
);

-- department_storesテーブルの作成
CREATE TABLE department_stores (
    code VARCHAR(50) PRIMARY KEY,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    GEOM GEOMETRY(Point, 4326)  -- 座標系としてWGS 84を想定
);

-- zipテーブルの作成
CREATE TABLE zip (
    zip_code VARCHAR(20) PRIMARY KEY,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    GEOM GEOMETRY(Point, 4326)  -- 座標系としてWGS 84を想定
);

-- ビューの作成
CREATE VIEW v_post_offices_with_distance AS
SELECT
    po.id,
    po.zip_code,
    po.lat,
    po.lng,
    ds.code,
    ST_Distance(ds.GEOM, po.GEOM) AS distance
FROM
    department_stores AS ds
INNER JOIN
    (
        SELECT
            post_offices.id,
            post_offices.zip_code,
            post_offices.code,
            z.lat,
            z.lng,
            z.GEOM
        FROM
            post_offices
        INNER JOIN
            zip z ON post_offices.zip_code = z.zip_code
        WHERE
            post_offices.code != ''
    ) AS po
ON ds.code = po.code;

-- post_officesテーブルへのサンプルデータの挿入
INSERT INTO post_offices (code, zip_code) VALUES
('V005', '100-0101'), -- この例では緯度経度は別途zipテーブルで管理
('V005', '100-0102'),
('V005', '100-0103'),
('V005', '100-0104'),
('V005', '100-0105'),
('V005', '100-0106'),
('V005', '100-0107'),
('V005', '100-0108'),
('V005', '100-0109'),
('V005', '100-0110'),
('V005', '100-0111'),
('V005', '100-0112'),
('V005', '100-0113'),
('V005', '100-0114'),
('V005', '100-0115'),
('V005', '100-0116'),
('V005', '100-0117'),
('V005', '100-0118'),
('V005', '100-0119'),
('V005', '100-0120');

-- department_storesテーブルのサンプルデータの挿入
INSERT INTO department_stores (code, lat, lng, GEOM) VALUES
('V001', 35.693833, 139.703549, ST_GeomFromText('POINT(139.703549 35.693833)', 4326)),
('V002', 35.662834, 139.704289, ST_GeomFromText('POINT(139.704289 35.662834)', 4326)),
('V003', 35.668308, 139.699297, ST_GeomFromText('POINT(139.699297 35.668308)', 4326)),
('V004', 35.685176, 139.711052, ST_GeomFromText('POINT(139.711052 35.685176)', 4326)),
('V005', 35.677295, 139.769101, ST_GeomFromText('POINT(139.769101 35.677295)', 4326));

-- zipテーブルへのサンプルデータの挿入
-- 都内サンプルデータ
INSERT INTO zip (zip_code, lat, lng, GEOM) VALUES
('100-0001', 35.682839, 139.759455, ST_GeomFromText('POINT(139.759455 35.682839)', 4326)),  -- 千代田区
('100-0002', 35.684084, 139.753382, ST_GeomFromText('POINT(139.753382 35.684084)', 4326)),  -- 千代田区
('153-0043', 35.641282, 139.698394, ST_GeomFromText('POINT(139.698394 35.641282)', 4326)),  -- 目黒区
('107-0052', 35.665212, 139.732863, ST_GeomFromText('POINT(139.732863 35.665212)', 4326)),  -- 港区
('160-0022', 35.693840, 139.703549, ST_GeomFromText('POINT(139.703549 35.693840)', 4326)),  -- 新宿区
('150-0001', 35.661777, 139.704051, ST_GeomFromText('POINT(139.704051 35.661777)', 4326));  -- 渋谷区
-- 各zipcodeの緯度経度を`V005`の周辺5km以内に収まるように調整したデータ
INSERT INTO zip (zip_code, lat, lng, GEOM) VALUES
('100-0101', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0102', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0103', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0104', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0105', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0106', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0107', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0108', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0109', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0110', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0111', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0112', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0113', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0114', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0115', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0116', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0117', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0118', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0119', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326)),
('100-0120', 35.676 + (RANDOM() - 0.5) * 0.045, 139.770 + (RANDOM() - 0.5) * 0.045, ST_GeomFromText('POINT(139.770 35.676)', 4326));