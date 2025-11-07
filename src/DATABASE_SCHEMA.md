# Korean Baseball Game Information Website - Database Schema

## Overview
This document describes the complete database schema for the Korean baseball game information website. The schema supports full CRUD operations and advanced analytics features.

---

## Tables

### 1. `sports`
Stores different types of sports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique sport identifier |
| `name` | VARCHAR(100) | NOT NULL | Sport name (e.g., "Baseball", "Soccer") |

**Sample Data:**
```sql
INSERT INTO sports (id, name) VALUES 
(1, 'Baseball'),
(2, 'Soccer');
```

---

### 2. `regions`
Stores geographical regions in Korea.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique region identifier |
| `name` | VARCHAR(100) | NOT NULL | Region name (Korean) |

**Sample Data:**
```sql
INSERT INTO regions (id, name) VALUES 
(1, '서울'),
(2, '인천'),
(3, '수원'),
(4, '대전'),
(5, '광주'),
(6, '대구'),
(7, '부산'),
(8, '창원');
```

---

### 3. `stadiums`
Stores stadium information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique stadium identifier |
| `name` | VARCHAR(200) | NOT NULL | Stadium name |
| `location` | VARCHAR(200) | NOT NULL | Detailed address |
| `capacity` | INT | NOT NULL | Maximum seating capacity |
| `region_id` | INT | FOREIGN KEY → regions(id) | Region where stadium is located |
| `sport_id` | INT | FOREIGN KEY → sports(id) | Primary sport played |

**Sample Data:**
```sql
INSERT INTO stadiums (id, name, location, capacity, region_id, sport_id) VALUES 
(1, 'Jamsil Baseball Stadium', '25 Olympic-ro, Songpa-gu, Seoul', 25000, 1, 1),
(2, 'Gocheok Sky Dome', '430 Gyeongin-ro, Guro-gu, Seoul', 16813, 1, 1),
(3, 'Incheon SSG Landers Field', '1 Michuhol-daero, Michuhol-gu, Incheon', 20000, 2, 1);
```

---

### 4. `teams`
Stores team information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique team identifier |
| `name` | VARCHAR(200) | NOT NULL | Team name (Korean proper noun) |
| `logo` | VARCHAR(500) | | Team logo URL |
| `sport_id` | INT | FOREIGN KEY → sports(id) | Sport the team plays |
| `region_id` | INT | FOREIGN KEY → regions(id) | Home region |

**Sample Data:**
```sql
INSERT INTO teams (id, name, logo, sport_id, region_id) VALUES 
(1, 'LG Twins', 'https://example.com/lg.png', 1, 1),
(2, 'Doosan Bears', 'https://example.com/doosan.png', 1, 1),
(3, 'Kiwoom Heroes', 'https://example.com/kiwoom.png', 1, 1),
(4, 'SSG Landers', 'https://example.com/ssg.png', 1, 2),
(5, 'KT Wiz', 'https://example.com/kt.png', 1, 3);
```

---

### 5. `matches`
Stores match/game information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique match identifier |
| `date` | DATE | NOT NULL | Match date (YYYY-MM-DD) |
| `time` | TIME | NOT NULL | Match start time (HH:MM) |
| `sport_id` | INT | FOREIGN KEY → sports(id) | Sport type |
| `stadium_id` | INT | FOREIGN KEY → stadiums(id) | Venue |
| `home_team_id` | INT | FOREIGN KEY → teams(id) | Home team |
| `away_team_id` | INT | FOREIGN KEY → teams(id) | Away team |
| `status` | ENUM('scheduled', 'live', 'finished') | NOT NULL, DEFAULT 'scheduled' | Current match status |

**Constraints:**
- `home_team_id` ≠ `away_team_id` (CHECK constraint)

**Sample Data:**
```sql
INSERT INTO matches (id, date, time, sport_id, stadium_id, home_team_id, away_team_id, status) VALUES 
(1, '2025-11-10', '18:30:00', 1, 1, 1, 2, 'scheduled'),
(2, '2025-11-10', '14:00:00', 1, 3, 4, 5, 'scheduled');
```

---

### 6. `broadcasts`
Stores broadcast information for matches.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique broadcast identifier |
| `match_id` | INT | FOREIGN KEY → matches(id) ON DELETE CASCADE | Associated match |
| `channel_name` | VARCHAR(200) | NOT NULL | Broadcasting channel |
| `link` | VARCHAR(500) | | Streaming URL |

**Sample Data:**
```sql
INSERT INTO broadcasts (id, match_id, channel_name, link) VALUES 
(1, 1, 'SPOTV', 'https://spotv.net'),
(2, 1, 'NAVER Sports', 'https://sports.naver.com'),
(3, 2, 'KBS N Sports', 'https://kbsn.com');
```

---

### 7. `match_stat`
Stores match statistics and results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique stat record identifier |
| `match_id` | INT | UNIQUE, FOREIGN KEY → matches(id) ON DELETE CASCADE | Associated match |
| `home_score` | INT | NOT NULL, DEFAULT 0 | Home team score |
| `away_score` | INT | NOT NULL, DEFAULT 0 | Away team score |
| `attendance` | INT | NOT NULL, DEFAULT 0 | Number of attendees |
| `highlights` | TEXT | NULL | Match highlights/notes |

**Sample Data:**
```sql
INSERT INTO match_stat (id, match_id, home_score, away_score, attendance, highlights) VALUES 
(1, 1, 5, 3, 18500, 'Home team won with a grand slam in the 7th inning'),
(2, 2, 2, 7, 15000, 'Away team dominated with strong pitching');
```

---

### 8. `stadium_stat` (Computed/View)
Aggregated statistics for stadiums. Can be implemented as a VIEW or materialized table.

| Column | Type | Description |
|--------|------|-------------|
| `stadium_id` | INT | Stadium identifier |
| `total_matches` | INT | Total number of matches held |
| `max_attendance` | INT | Highest attendance recorded |
| `avg_attendance` | DECIMAL(10,2) | Average attendance |
| `most_played_sport` | VARCHAR(100) | Sport most frequently played |

**Implementation as VIEW:**
```sql
CREATE VIEW stadium_stat AS
SELECT 
    s.id AS stadium_id,
    s.name AS stadium_name,
    COUNT(m.id) AS total_matches,
    COALESCE(MAX(ms.attendance), 0) AS max_attendance,
    COALESCE(AVG(ms.attendance), 0) AS avg_attendance,
    sp.name AS most_played_sport
FROM stadiums s
LEFT JOIN matches m ON s.id = m.stadium_id
LEFT JOIN match_stat ms ON m.id = ms.match_id
LEFT JOIN sports sp ON s.sport_id = sp.id
GROUP BY s.id, s.name, sp.name;
```

---

## Relationships Diagram

```
sports (1) ──────┬──────> (N) stadiums
                 └──────> (N) teams
                 └──────> (N) matches

regions (1) ─────┬──────> (N) stadiums
                 └──────> (N) teams

stadiums (1) ───────────> (N) matches

teams (1) ──┬───────────> (N) matches (as home_team)
            └───────────> (N) matches (as away_team)

matches (1) ─────┬──────> (N) broadcasts
                 └──────> (1) match_stat
```

---

## Required Advanced Features

### 1. Aggregates
Examples:
- Total matches per stadium
- Average attendance per region
- Total broadcasts per channel

```sql
-- Example: Top 5 stadiums by total matches
SELECT s.name, COUNT(m.id) as total_matches
FROM stadiums s
LEFT JOIN matches m ON s.id = m.stadium_id
GROUP BY s.id, s.name
ORDER BY total_matches DESC
LIMIT 5;
```

### 2. OLAP (Rollup/Drill-down)
```sql
-- Example: Attendance analysis with ROLLUP
SELECT 
    r.name as region,
    s.name as stadium,
    COUNT(m.id) as match_count,
    AVG(ms.attendance) as avg_attendance
FROM regions r
JOIN stadiums s ON r.id = s.region_id
JOIN matches m ON s.id = m.stadium_id
LEFT JOIN match_stat ms ON m.id = ms.match_id
GROUP BY r.name, s.name WITH ROLLUP;
```

### 3. Ranking
```sql
-- Example: Rank teams by total wins
SELECT 
    t.name,
    COUNT(*) as wins,
    RANK() OVER (ORDER BY COUNT(*) DESC) as win_rank
FROM teams t
JOIN matches m ON t.id = m.home_team_id OR t.id = m.away_team_id
JOIN match_stat ms ON m.id = ms.match_id
WHERE (t.id = m.home_team_id AND ms.home_score > ms.away_score)
   OR (t.id = m.away_team_id AND ms.away_score > ms.home_score)
GROUP BY t.id, t.name;
```

### 4. Windowing
```sql
-- Example: Running total of attendance per stadium
SELECT 
    s.name,
    m.date,
    ms.attendance,
    SUM(ms.attendance) OVER (PARTITION BY s.id ORDER BY m.date) as running_total
FROM stadiums s
JOIN matches m ON s.id = m.stadium_id
JOIN match_stat ms ON m.id = ms.match_id
ORDER BY s.name, m.date;
```

---

## Transaction Example

```sql
-- Example: Adding a new match with broadcast info (atomic operation)
START TRANSACTION;

INSERT INTO matches (date, time, sport_id, stadium_id, home_team_id, away_team_id, status)
VALUES ('2025-11-15', '18:00:00', 1, 1, 1, 3, 'scheduled');

SET @match_id = LAST_INSERT_ID();

INSERT INTO broadcasts (match_id, channel_name, link)
VALUES 
    (@match_id, 'SPOTV', 'https://spotv.net'),
    (@match_id, 'NAVER Sports', 'https://sports.naver.com');

COMMIT;
```

---

## Indexes (Recommended)

```sql
-- Performance optimization
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_stadium ON matches(stadium_id);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX idx_broadcasts_match ON broadcasts(match_id);
CREATE INDEX idx_match_stat_match ON match_stat(match_id);
CREATE INDEX idx_stadiums_region ON stadiums(region_id);
CREATE INDEX idx_teams_region ON teams(region_id);
```

---

## Notes for Backend Implementation

1. **PreparedStatements**: All queries should use PreparedStatements to prevent SQL injection
2. **PHP Sessions**: Use `$_SESSION` to store user preferences, filters, and pagination state
3. **Transactions**: Use for operations that modify multiple tables (e.g., adding match + broadcasts)
4. **Foreign Keys**: Enable ON DELETE CASCADE for dependent data (broadcasts, match_stat)
5. **Data Validation**: Validate that home_team and away_team are different before insertion
6. **Korean Text**: Use UTF-8 character encoding for proper Korean text support

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-06  
**Contact:** Frontend Team
