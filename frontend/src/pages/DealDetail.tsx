import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getDeal, getActivities } from '../api';
import MemoEditor from '../components/MemoEditor';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DealDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dealId = parseInt(id || '0');

    const { data: deal, isLoading: loadingDeal } = useQuery({
        queryKey: ['deal', dealId],
        queryFn: () => getDeal(dealId)
    });

    const { data: activities } = useQuery({
        queryKey: ['activities', dealId],
        queryFn: () => getActivities(dealId)
    });

    const { user } = useAuth();
    const deleteMutation = useMutation({
        mutationFn: () => axios.delete(`http://localhost:8000/deals/${dealId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        onSuccess: () => {
            navigate('/');
        }
    });

    if (loadingDeal) return <div>Loading...</div>;
    if (!deal) return <div>Deal not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <button onClick={() => navigate('/')} className="mb-4 text-blue-600 hover:underline">
                &larr; Back to Pipeline
            </button>
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
                        {deal.company_url && (
                            <a href={deal.company_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {deal.company_url}
                            </a>
                        )}
                        <div className="mt-2 flex gap-4 text-sm text-gray-600">
                            <span>Round: {deal.round || 'N/A'}</span>
                            <span>Check: ${deal.check_size}M</span>
                            <span>Stage: {deal.stage}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${deal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {deal.status.toUpperCase()}
                        </span>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this deal?')) {
                                        deleteMutation.mutate();
                                    }
                                }}
                                className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
                            >
                                Delete Deal
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <MemoEditor dealId={dealId} />
                </div>
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold text-gray-700 mb-4">Activity Log</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {activities?.map((activity: any) => (
                                <div key={activity.id} className="text-sm border-l-2 border-gray-200 pl-3 pb-2">
                                    <p className="text-gray-800">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{format(new Date(activity.timestamp), 'MMM d, h:mm a')}</p>
                                </div>
                            ))}
                            {activities?.length === 0 && <p className="text-gray-500 text-sm">No activity yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealDetail;
