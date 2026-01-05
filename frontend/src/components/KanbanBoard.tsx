import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getDeals, updateDeal } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const stages = ['Sourced', 'Screen', 'Diligence', 'IC', 'Invested', 'Passed'];

const KanbanBoard = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: deals, isLoading } = useQuery({ queryKey: ['deals'], queryFn: getDeals });

    const updateDealMutation = useMutation({
        mutationFn: ({ id, stage }: { id: number, stage: string }) => updateDeal(id, { stage: stage as any }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.detail || "Failed to move deal");
            queryClient.invalidateQueries({ queryKey: ['deals'] }); // Revert UI
        }
    });

    if (isLoading) return <div>Loading pipeline...</div>;

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStage = destination.droppableId;
        updateDealMutation.mutate({ id: parseInt(draggableId), stage: newStage });
    };

    return (
        <div className="h-[calc(100vh-150px)] overflow-hidden">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-6 gap-4 h-full min-w-[1024px] overflow-x-auto">
                    {stages.map(stage => (
                        <div key={stage} className="bg-gray-100/50 rounded-xl p-4 flex flex-col h-full border border-gray-200">
                            <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between text-sm uppercase tracking-wide">
                                {stage}
                                <span className={clsx(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    "bg-white border border-gray-200 text-gray-600"
                                )}>
                                    {deals?.filter(d => d.stage === stage).length}
                                </span>
                            </h3>
                            <Droppable droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={clsx(
                                            "flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar transition-colors rounded-lg",
                                            snapshot.isDraggingOver && "bg-blue-50/50"
                                        )}
                                    >
                                        {deals?.filter(d => d.stage === stage).map((deal, index) => (
                                            <Draggable key={deal.id} draggableId={deal.id?.toString() || ''} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => navigate(`/deals/${deal.id}`)}
                                                        className={clsx(
                                                            "bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group",
                                                            snapshot.isDragging ? "rotate-2 shadow-xl ring-2 ring-blue-500/20 z-50" : "hover:-translate-y-0.5"
                                                        )}
                                                    >
                                                        <h4 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                            {deal.name}
                                                        </h4>
                                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                                                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                                {deal.check_size ? `$${deal.check_size}m` : '-'}
                                                            </span>
                                                            <span className={clsx(
                                                                "w-2 h-2 rounded-full ring-2 ring-white",
                                                                deal.status === 'active' ? "bg-emerald-500" : "bg-gray-300"
                                                            )} title={deal.status} />
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
