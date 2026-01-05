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
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-150px)]">
            <DragDropContext onDragEnd={onDragEnd}>
                {stages.map(stage => (
                    <div key={stage} className="min-w-[300px] bg-gray-100 rounded-lg p-4 flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-4 flex justify-between">
                            {stage}
                            <span className="bg-gray-200 px-2 py-0.5 rounded text-sm text-gray-600">
                                {deals?.filter(d => d.stage === stage).length}
                            </span>
                        </h3>
                        <Droppable droppableId={stage}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex-1 space-y-3"
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
                                                        "bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer",
                                                        snapshot.isDragging && "rotate-2 shadow-lg ring-2 ring-blue-500/20"
                                                    )}
                                                >
                                                    <h4 className="font-medium text-gray-900">{deal.name}</h4>
                                                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                                        <span>{deal.check_size ? `$${deal.check_size}m` : '-'}</span>
                                                        <span className={clsx(
                                                            "w-2 h-2 rounded-full",
                                                            deal.status === 'active' ? "bg-green-500" : "bg-gray-300"
                                                        )} />
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
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
