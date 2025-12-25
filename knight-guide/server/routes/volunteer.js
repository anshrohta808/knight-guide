import express from 'express';

const router = express.Router();

// Mock Data
const TASKS = [
    { id: 1, title: 'Verify Ramp at Central Park', location: '1.2km away', points: 50, type: 'Verification' },
    { id: 2, title: 'Audit Subway Entrance', location: '0.5km away', points: 30, type: 'Audit' },
    { id: 3, title: 'Photo of Accessible Entrance', location: '2.0km away', points: 20, type: 'Photo' },
    { id: 4, title: 'Check Elevator Status', location: '3.5km away', points: 40, type: 'Status Check' },
];

const LEADERBOARD = [
    { id: 1, name: 'Sarah J.', points: 1250, badge: '🥇' },
    { id: 2, name: 'Mike R.', points: 980, badge: '🥈' },
    { id: 3, name: 'Alex T.', points: 850, badge: '🥉' },
    // "You" would be dynamically inserted or handled by the frontend if auth was fully linked
];

// GET /api/volunteer/tasks
router.get('/tasks', (req, res) => {
    // In a real app, filtering by location/user would happen here
    res.json(TASKS);
});

// GET /api/volunteer/leaderboard
router.get('/leaderboard', (req, res) => {
    res.json(LEADERBOARD);
});

// POST /api/volunteer/join-mission
router.post('/join-mission', (req, res) => {
    const { taskId } = req.body;
    const task = TASKS.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Logic to assign task to user would go here
    res.json({ success: true, message: `Successfully joined mission: ${task.title}` });
});

export default router;
