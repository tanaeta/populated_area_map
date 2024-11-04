-- もっとも遠い郵便局を取得するクエリ
SELECT
    v.code,
    v.id,
    v.zip_code,
    v.lat,
    v.lng,
    v.distance
FROM
    v_post_offices_with_distance v
JOIN
    (
        SELECT
            code,
            MAX(distance) AS max_distance
        FROM
            v_post_offices_with_distance
        GROUP BY
            code
    ) max_distances 
ON v.code = max_distances.code 
AND v.distance = max_distances.max_distance
ORDER BY 
    v.code;

-- もっとも遠い郵便局を取得するクエリ（サブクエリを使わないバージョン）
SELECT
    code,
    id,
    MAX(distance) AS max_distance
FROM
    v_post_offices_with_distance
GROUP BY
    code;

-- 郵便局の数を距離別に集計するクエリ
SELECT
    code,
    distance_range,
    COUNT(*) AS post_office_count
FROM
    (
        SELECT
            code,
            CASE
                WHEN distance < 5 THEN '0-5 km'
                WHEN distance >= 5 AND distance < 10 THEN '5-10 km'
                WHEN distance >= 10 AND distance < 15 THEN '10-15 km'
                ELSE '15+ km'
            END AS distance_range
        FROM
            v_post_offices_with_distance
    ) AS categorized_distances
GROUP BY
    code,
    distance_range
ORDER BY
    code,
    distance_range;