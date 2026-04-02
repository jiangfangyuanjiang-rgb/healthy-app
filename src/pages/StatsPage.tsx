import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/shared';
import { dbPromise } from '../lib/db';
import { getProfile } from '../lib/db';

interface BodyRecord {
  id?: number;
  date: string;
  weight: number;
  bodyFat?: number;
  bmi: number;
}

export function StatsPage() {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newRecord, setNewRecord] = useState({
    weight: 50,
    bodyFat: 0,
  });
  const [profile, setProfile] = useState({ height: 173 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const prof = await getProfile();
    if (prof) {
      setProfile(prof);
      setNewRecord({ weight: prof.weight, bodyFat: 0 });
    }

    const db = await dbPromise;
    const allRecords = await db.getAll('bodyData');
    setRecords(allRecords.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }

  async function handleAddRecord() {
    setSaving(true);
    const bmi = newRecord.weight / ((profile.height / 100) ** 2);

    const db = await dbPromise;
    await db.add('bodyData', {
      date: new Date().toISOString().split('T')[0],
      weight: newRecord.weight,
      bodyFat: newRecord.bodyFat || undefined,
      bmi: parseFloat(bmi.toFixed(1)),
    });

    await loadData();
    setShowInput(false);
    setSaving(false);
  }

  const latestRecord = records[0];
  const oldestRecord = records[records.length - 1];
  const weightChange = latestRecord && oldestRecord
    ? (latestRecord.weight - oldestRecord.weight).toFixed(1)
    : '0';

  return (
    <div className="h-full bg-[#ededed] overflow-y-auto pb-16">
      <div className="bg-white px-4 py-3 border-b border-[#d9d9d9]">
        <h1 className="text-lg font-medium text-[#191919]">数据分析</h1>
      </div>

      <div className="p-3 space-y-3">
        {/* 快速统计 */}
        {latestRecord && (
          <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#07c160]">{latestRecord.weight}</p>
                <p className="text-xs text-[#999999] mt-1">当前体重(kg)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191919]">{latestRecord.bmi}</p>
                <p className="text-xs text-[#999999] mt-1">BMI</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${parseFloat(weightChange) >= 0 ? 'text-[#07c160]' : 'text-[#fa5151]'}`}>
                  {parseFloat(weightChange) >= 0 ? '+' : ''}{weightChange}
                </p>
                <p className="text-xs text-[#999999] mt-1">变化(kg)</p>
              </div>
            </div>
          </Card>
        )}

        {/* 添加记录按钮 */}
        <Button onClick={() => setShowInput(!showInput)} variant="secondary">
          {showInput ? '取消' : '📝 记录今日数据'}
        </Button>

        {/* 添加记录表单 */}
        {showInput && (
          <Card>
            <div className="space-y-4">
              <Input
                label="体重"
                type="number"
                value={newRecord.weight}
                onChange={(v) => setNewRecord({ ...newRecord, weight: v })}
                unit="kg"
              />
              <Input
                label="体脂率（可选）"
                type="number"
                value={newRecord.bodyFat}
                onChange={(v) => setNewRecord({ ...newRecord, bodyFat: v })}
                unit="%"
              />
              <Button onClick={handleAddRecord} loading={saving}>
                保存记录
              </Button>
            </div>
          </Card>
        )}

        {/* 简易趋势展示 */}
        {records.length > 1 && (
          <Card>
            <h3 className="text-sm font-medium text-[#191919] mb-3">体重趋势</h3>
            <div className="space-y-2">
              {records.slice(0, 7).map((record, idx) => {
                const prevRecord = records[idx + 1];
                const change = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : '0';
                return (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                    <span className="text-xs text-[#999999]">{record.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#191919]">
                        <span className="text-[#07c160] font-medium">{record.weight}</span> kg
                      </span>
                      {prevRecord && (
                        <span className={`text-xs ${parseFloat(change) >= 0 ? 'text-[#07c160]' : 'text-[#fa5151]'}`}>
                          {parseFloat(change) >= 0 ? '+' : ''}{change}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 历史记录列表 */}
        {records.length > 0 && (
          <Card>
            <h3 className="text-sm font-medium text-[#191919] mb-3">历史记录</h3>
            <div className="space-y-2">
              {records.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-[#191919]">
                      {new Date(record.date).toLocaleDateString('zh-CN')}
                    </p>
                    {record.bodyFat && (
                      <p className="text-xs text-[#999999]">体脂率: {record.bodyFat}%</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#191919]">
                      {record.weight} kg
                    </p>
                    <p className="text-xs text-[#999999]">BMI {record.bmi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {records.length === 0 && !showInput && (
          <Card>
            <div className="text-center py-8">
              <p className="text-[#999999] text-sm mb-4">还没有数据记录</p>
              <p className="text-xs text-[#999999]">点击上方按钮开始记录你的身体数据</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}




