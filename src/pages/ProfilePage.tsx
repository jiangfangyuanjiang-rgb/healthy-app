import { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/shared';
import { getProfile, saveProfile } from '../lib/db';

export function ProfilePage() {
  const [profile, setProfile] = useState({
    height: 173,
    weight: 50,
    age: 25,
    goal: '增重增肌',
    allergies: [] as string[],
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const data = await getProfile();
    if (data) {
      setProfile(data);
    }
  }

  async function handleSave() {
    setSaving(true);
    await saveProfile({
      ...profile,
      id: 'main',
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    setEditing(false);
  }

  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  return (
    <div className="h-full bg-[#ededed]">
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-[#d9d9d9]">
        <h1 className="text-lg font-medium text-[#191919]">个人信息</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="text-[#576b95] text-sm"
        >
          {editing ? '取消' : '编辑'}
        </button>
      </div>

      <div className="p-3 space-y-3">
        <Card>
          <div className="space-y-4">
            <Input
              label="身高"
              type="number"
              value={profile.height}
              onChange={(v) => setProfile({ ...profile, height: v })}
              unit="cm"
              disabled={!editing}
            />
            <Input
              label="体重"
              type="number"
              value={profile.weight}
              onChange={(v) => setProfile({ ...profile, weight: v })}
              unit="kg"
              disabled={!editing}
            />
            <Input
              label="年龄"
              type="number"
              value={profile.age}
              onChange={(v) => setProfile({ ...profile, age: v })}
              unit="岁"
              disabled={!editing}
            />
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <h3 className="text-sm text-[#999999]">身体指标</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#07c160]">{bmi}</p>
                <p className="text-xs text-[#999999] mt-1">BMI</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#191919]">{profile.height}</p>
                <p className="text-xs text-[#999999] mt-1">身高(cm)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#191919]">{profile.weight}</p>
                <p className="text-xs text-[#999999] mt-1">体重(kg)</p>
              </div>
            </div>
          </div>
        </Card>

        {!editing && parseFloat(bmi) < 18.5 && (
          <Card className="bg-[#fef7e0] border border-[#faad14]">
            <div className="space-y-2">
              <h3 className="font-medium text-[#d48806] flex items-center gap-2">
                <span>⚠️</span>
                健康提示
              </h3>
              <p className="text-sm text-[#d48806]">
                您的 BMI 偏低({bmi}),建议:
              </p>
              <ul className="text-sm text-[#d48806] space-y-1 pl-4">
                <li>• 增加蛋白质摄入(鸡蛋、牛奶、肉类)</li>
                <li>• 规律进行无氧训练</li>
                <li>• 保证充足睡眠(8小时+)</li>
              </ul>
            </div>
          </Card>
        )}

        {editing && (
          <div className="px-4">
            <Button onClick={handleSave} loading={saving}>
              保存信息
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
