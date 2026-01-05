import { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import CreateDealModal from '../components/CreateDealModal';

const DealPipeline = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Deal Pipeline</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm transition-colors"
                >
                    + New Deal
                </button>
            </div>
            <KanbanBoard />
            {isModalOpen && <CreateDealModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default DealPipeline;
