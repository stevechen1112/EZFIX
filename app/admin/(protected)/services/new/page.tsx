import Link from "next/link";
import { createService } from "../actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function NewServicePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Link href="/admin/services" className="hover:text-brand-700">← 返回列表</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">新增服務項目</h1>

      <form action={createService} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">標題 *</label>
          <input
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="例：紗窗修理訂製"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">說明 *</label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">特色條列（每行一項）</label>
          <textarea
            name="features"
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
            placeholder={"舊網更換、窗輪更新、膠條更換\n鋁框、塑鋼、不鏽鋼、隱藏式"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">圖示</label>
            <select
              name="icon"
              defaultValue="wrench"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="wrench">🔧 扳手</option>
              <option value="frame">🪟 窗框</option>
              <option value="door-open">🚪 門</option>
              <option value="shield-check">🛡️ 防護</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        <ImageUploader name="image" label="配圖（選填）" folder="services" />
        <div className="flex items-center gap-2">
          <input id="isActive" name="isActive" type="checkbox" defaultChecked className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm text-gray-700">立即啟用</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-6 py-2.5 rounded-lg">
            建立
          </button>
          <Link href="/admin/services" className="px-6 py-2.5 text-gray-600 hover:text-gray-900">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
