
mongodb_project_1.md
דף
1
/
1
100%
# פרויקט Atlas: Score Tracker — לוח תוצאות חי

## הסיפור

הקבוצה שלכם החליטה לשחק משחקי רטרו — Tetris, Snake, Space Invaders — ורוצה לדעת מי הגיבור של כולם.  
אתם בונים את ה-backend שמאחסן תוצאות ב-Atlas ומחזיר לוחות תוצאות חיים.

**היתרון:** כל שדה שנוסף ל-Atlas Dashboard — רואים אותו ב-real time. כשהחבר שלכם מגיש תוצאה, היא מופיעה מיד ב-Browse Collections.

---

## מבנה הפרויקט

```
score-tracker/
  package.json        ← { "type": "module" }
  .env                ← MONGO_URI מ-Atlas
  server.js           ← Express + mongoose.connect
  models/
    Score.js          ← ה-Schema שתגדירו
  routes/
    scores.js         ← הרצת תוצאות (POST, GET)
    leaderboard.js    ← לוחות תוצאות (aggregation)
    stats.js          ← סטטיסטיקות כלליות
```

---

## Setup Atlas

1. צרו cluster M0 Free ב-[cloud.mongodb.com](https://cloud.mongodb.com)
2. הוסיפו משתמש ב-Database Access
3. פתחו רשת ל-`0.0.0.0/0` ב-Network Access
4. קבלו connection string והכניסו ל-`.env`:

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/score-tracker
PORT=3000
```

---

## Schema — Score

השדות שצריך להגדיר ב-`models/Score.js`:

| שדה | סוג | חובה | הערה |
|-----|-----|------|------|
| `playerName` | String | ✓ | שם השחקן |
| `game` | String | ✓ | שם המשחק (tetris / snake / space-invaders) |
| `points` | Number | ✓ | ניקוד, לא יכול להיות שלילי |
| `level` | Number | | האיזה level הגיעו |
| `duration` | Number | | כמה שניות שיחקו |
| timestamps | — | — | `createdAt` ו-`updatedAt` אוטומטיים |

---

## Endpoints לממש

### הגשת תוצאה
**POST `/scores`**  
קבלת JSON עם `playerName`, `game`, `points`, ואופציונלית `level` ו-`duration`.  
שמירה ל-Atlas, החזרת המסמך שנשמר.

---

### לוח תוצאות למשחק ספציפי
**GET `/leaderboard/:game`**  
מחזיר את 10 השחקנים הטובים ביותר במשחק זה — לפי ניקוד גבוה.  
**דרוש: aggregation pipeline** (לא `.find().sort()`).

דוגמה לתוצאה:
```json
[
  { "rank": 1, "playerName": "neria", "points": 12400, "level": 8 },
  { "rank": 2, "playerName": "gal",   "points": 9800,  "level": 6 }
]
```

---

### לוח תוצאות גלובלי
**GET `/leaderboard/global`**  
מחזיר 10 תוצאות גבוהות בכל המשחקים ביחד.  
כל רשומה: `playerName`, `game`, `points`, `createdAt`.

---

### פרופיל שחקן
**GET `/player/:name`**  
מחזיר שני דברים ביחד (aggregation עם `$facet`):
- כל התוצאות של השחקן (ממוינות מחדש לישן)
- הניקוד הגבוה ביותר שלו **לכל משחק בנפרד**

דוגמה לתוצאה:
```json
{
  "allScores": [ ... ],
  "bestPerGame": [
    { "game": "tetris",        "best": 12400 },
    { "game": "space-invaders","best": 7200  }
  ]
}
```

---

### סטטיסטיקות כלליות
**GET `/stats`**  
מחזיר בקריאה אחת (aggregation עם `$facet`):
- הניקוד הגבוה ביותר אי פעם (שם שחקן + ניקוד + משחק)
- מספר התוצאות שנשמרו סה"כ
- המשחק הפופולרי ביותר (הכי הרבה הגשות)
- הניקוד הממוצע בכל המשחקים

---

### רשימת משחקים
**GET `/games`**  
מחזיר רשימת שמות משחקים שיש להם תוצאות — ללא כפילויות.  
השתמשו ב-`distinct()`.

---

## הדגמת Aggregation Pipeline

כדי לבנות את לוח התוצאות, תשתמשו ב-aggregation pipeline:

```javascript
// דוגמה: top 10 למשחק ספציפי עם rank
const results = await Score.aggregate([
  { $match: { game: req.params.game } },
  { $sort: { points: -1 } },
  { $limit: 10 },
  { $addFields: { rank: { $add: [{ $indexOfArray: ['$$ROOT', '$$ROOT'] }, 1] } } },
]);
```

**הבעיה:** `$indexOfArray` לא יעבוד כאן. חשבו איך להוסיף `rank` (1, 2, 3...) לכל מסמך בצורה אחרת — זה חלק מהאתגר.

---

## בדיקה ידנית

הוסיפו כמה תוצאות עם curl או Postman, ואז:

```bash
# הוספת תוצאה
curl -X POST localhost:3000/scores \
  -H "Content-Type: application/json" \
  -d '{"playerName":"neria","game":"tetris","points":9500,"level":7}'

# צפייה בלוח תוצאות
curl localhost:3000/leaderboard/tetris
```

אחר כך — פתחו **Atlas Dashboard → Browse Collections** וראו את הנתונים שנשמרו ב-cloud.

---

## קריטריונים להצלחה

| קריטריון | ✓ |
|----------|---|
| חיבור ל-Atlas עובד (`Connected` בלוג) | |
| POST `/scores` שומר ל-Atlas ואפשר לראות ב-Dashboard | |
| GET `/leaderboard/:game` משתמש ב-aggregate (לא find) | |
| GET `/player/:name` מחזיר bestPerGame לכל משחק | |
| GET `/stats` עובד עם `$facet` (קריאה אחת) | |
| שימוש ב-`import`/`export` לאורך כל הפרויקט | |

---

## בונוס

- **POST `/scores`** — הוסיפו ולידציה: אם `points` שלילי, החזירו `400 Bad Request`
- **GET `/player/:name/rank/:game`** — מה הדירוג של השחקן במשחק ספציפי? (מקום 1, 2, 3...)
- **GET `/leaderboard/daily`** — לוח תוצאות של היום בלבד (השתמשו ב-`$gte` על `createdAt`)
- **DELETE `/scores/:id`** — מחיקת תוצאה עם בדיקה שה-id קיים
המערכת מציגה את mongodb_project_1.md.