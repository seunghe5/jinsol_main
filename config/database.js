const mariadb = require('mariadb');

// 1. Connection Pool 설정 (DB 접속 정보)
const pool = mariadb.createPool({
     host: 'localhost', 
     user: 'jinsol', 
     password: '홈페이지_전용_비밀번호', 
     database: 'new_site_db', 
     connectionLimit: 5 
});

// 2. 쿼리를 실행하는 함수를 정의하고 내보냅니다.
async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql, params);
        return res;
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

module.exports = { query }; // 다른 파일에서 사용할 수 있도록 내보냄