const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('./config');

const app = express();
const port = process.env.PORT || 80; // 또는 다른 포트 번호
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    // 배포 후 콘솔 로그가 호스팅 서비스의 로그 시스템에 기록됩니다.
});
app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  try {
    const { nickname, username, password, address, phone_number } = req.body;

    // 데이터 유효성 검사 (간단한 예시)
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

    // 비밀번호 암호화 (실제 운영 환경에서는 bcrypt 등을 사용하여 암호화해야 합니다!)
    const hashedPassword = password; // 임시로 암호화 없이 저장

    // 데이터베이스에 사용자 정보 저장
    const [result] = await connection.execute(
      'INSERT INTO users (nickname, username, password, address, phone_number) VALUES (?, ?, ?, ?, ?)',
      [nickname, username, hashedPassword, address, phone_number]
    );

    await connection.end();

    res.status(201).json({ message: '회원 가입이 완료되었습니다.', userId: result.insertId });

  } catch (error) {
    console.error('회원 가입 API 오류:', error);
    res.status(500).json({ message: '회원 가입 처리 중 오류가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});