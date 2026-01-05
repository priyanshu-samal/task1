import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMemo, saveMemo, getMemoHistory } from '../api';
import { format } from 'date-fns';

const SECTIONS = ['Summary', 'Market', 'Product', 'Traction', 'Risks', 'Open Questions'];

const MemoEditor = ({ dealId }: { dealId: number }) => {
    const [activeTab, setActiveTab] = useState<'edit' | 'history'>('edit');
    const [sections, setSections] = useState<Record<string, string>>({});

    // const queryClient = useQueryClient();

    const { data: memo, isLoading } = useQuery({
        queryKey: ['memo', dealId],
        queryFn: () => getMemo(dealId)
    });

    useEffect(() => {
        if (memo && memo.content) {
            try {
                setSections(JSON.parse(memo.content));
            } catch (e) {
                // ignore
            }
        } else if (!isLoading) {
            // Initialize empty if loaded and no content or no memo
            const init: any = {};
            SECTIONS.forEach(s => init[s] = '');
            // Only set if we haven't set yet? 
            // Actually, if we switch deals, we want to reset.
            // But we shouldn't overwrite if user is typing... 
            // but this only runs when 'memo' changes.
            setSections(init);
        }
    }, [memo, isLoading]);

    const { data: history } = useQuery({
        queryKey: ['memo_history', dealId],
        queryFn: () => getMemoHistory(dealId),
        enabled: activeTab === 'history'
    });

    const mutation = useMutation({
        mutationFn: (content: any) => saveMemo(dealId, content),
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['memo', dealId] }); 
            // Don't invalidate immediately to keep cursor? actually we don't save per keystroke.
            alert('Saved new version!');
        }
    });

    const handleSave = () => {
        mutation.mutate(sections);
    };

    if (isLoading) return <div>Loading memo...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'edit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('edit')}
                    >
                        Current Memo
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Version History
                    </button>
                </div>
                {activeTab === 'edit' && (
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Save Version
                    </button>
                )}
            </div>

            {activeTab === 'edit' ? (
                <div className="space-y-6">
                    {SECTIONS.map(section => (
                        <div key={section}>
                            <h4 className="font-bold text-gray-700 mb-2">{section}</h4>
                            <textarea
                                className="w-full border rounded p-3 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={sections[section] || ''}
                                onChange={(e) => setSections(prev => ({ ...prev, [section]: e.target.value }))}
                                placeholder={`Write about ${section}... (Markdown supported)`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {history?.map((version) => (
                        <div key={version.id} className="border rounded p-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>Version #{version.id}</span>
                                <span>{format(new Date(version.created_at), 'PPP p')}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap font-mono">
                                {/* Showing raw JSON for simplicity or parsed content */}
                                {version.content}
                            </div>
                        </div>
                    ))}
                    {history?.length === 0 && <p className="text-gray-500">No versions yet.</p>}
                </div>
            )}
        </div>
    );
};

export default MemoEditor;
