import { useState } from 'react';
import { Card, Button } from '../components/shared';
import { generateWorkoutPlan } from '../lib/ai';
import { getProfile } from '../lib/db';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  plan: WorkoutDay[];
}

export function WorkoutPage() {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');

    try {
      const profile = await getProfile();
      if (!profile) {
        setError('请先在"我的"页面填写个人信息');
        setLoading(false);
        return;
      }

      const result = await generateWorkoutPlan(profile);
      setWorkout(result);
    } catch (err) {
      setError('生成失败,请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full bg-[#ededed]">
      <div className="bg-white px-4 py-3 border-b border-[#d9d9d9]">
        <h1 className="text-lg font-medium text-[#191919]">AI 训练计划</h1>
      </div>

      <div className="p-3 space-y-3">
        <Button onClick={handleGenerate} loading={loading}>
          {loading ? '正在生成...' : '💪 AI 生成本周计划'}
        </Button>

        {error && (
          <div className="bg-[#fa5151] bg-opacity-10 border border-[#fa5151] rounded-lg p-3 text-[#fa5151] text-sm">
            {error}
          </div>
        )}

        {workout && (
          <div className="space-y-3">
            {workout.plan.map((day, idx) => (
              <DayCard key={idx} day={day} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DayCard({ day }: { day: WorkoutDay }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <h3 className="font-medium text-[#191919]">{day.day}</h3>
            <p className="text-xs text-[#999999]">{day.focus}</p>
          </div>
          <span className="text-xl">
            {expanded ? '⬆️' : '⬇️'}
          </span>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t border-[#f0f0f0]">
            {day.exercises.map((ex, idx) => (
              <div key={idx} className="bg-[#f7f7f7] rounded-lg p-3">
                <h4 className="font-medium text-[#191919] mb-2">{ex.name}</h4>
                <div className="grid grid-cols-4 gap-2 text-xs text-[#999999]">
                  <div>
                    <p className="text-[#999999]">组数</p>
                    <p className="font-medium text-[#191919]">{ex.sets}</p>
                  </div>
                  <div>
                    <p className="text-[#999999]">次数</p>
                    <p className="font-medium text-[#191919]">{ex.reps}</p>
                  </div>
                  <div>
                    <p className="text-[#999999]">重量</p>
                    <p className="font-medium text-[#191919]">{ex.weight}</p>
                  </div>
                  <div>
                    <p className="text-[#999999]">休息</p>
                    <p className="font-medium text-[#191919]">{ex.rest}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}


