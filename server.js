const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config');
const path = require('path'); // 반드시 필요

const app = express();
const port = 80; // 가비아 서버용 포트

app.use(cors());
app.use(bodyParser.json());



// 확인용 로그 (서버 켤 때 경로 출력)
console.log("Serving static files from:", root);
// 2. [회원 가입 API]
app.post('/api/register', async (req, res) => {
  try {
    const { nickname, username, password, address, phone_number } = req.body;

    if (!nickname || !username || !password) {
      return res.status(400).json({ message: '닉네임, 아이디, 비밀번호는 필수 입력 항목입니다.' });
    }

    const connection = await mysql.createConnection(config);

    // 아이디 중복 확인
    const [existingUser] = await connection.execute(
      'SELECT username FROM users WHERE username = ?',
      [username]
    );

    if (existingUser.length > 0) {
      await connection.end();
      return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    // 데이터베이스에 사용자 정보 저장
    const [result] = await connection.execute(
      'INSERT INTO users (nickname, username, password, address, phone_number) VALUES (?, ?, ?, ?, ?)',
      [nickname, username, password, address, phone_number]
    );

    await connection.end();
    res.status(201).json({ message: '회원 가입이 완료되었습니다.', userId: result.insertId });

  } catch (error) {
    console.error('회원 가입 API 오류:', error);
    res.status(500).json({ message: '회원 가입 처리 중 오류가 발생했습니다.' });
  }
});
// 1. [정적 파일 설정] API보다 아래에 있어도 되지만 명확히 추가해야 함
const root = path.resolve(__dirname);
app.use(express.static(root, { extensions: ['html'] }));
app.use('/_astro', express.static(path.join(root, '_astro')));
// 3. [서버 시작] 맨 밑에 한 번만 작성합니다.
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 정상 실행 중입니다.`);
});
