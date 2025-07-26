// src/components/admin/AdminCard.jsx
export default function AdminCard({ title, value, children }) {
	return (
		<div className="bg-slate-700 text-white rounded-lg shadow p-4 m-2">
			{title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
			{value && <p className="text-2xl font-bold text-blue-400">{value}</p>}
			{children}
		</div>
	);
}
