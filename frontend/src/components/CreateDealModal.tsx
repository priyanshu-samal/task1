import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDeal } from '../api';

interface CreateDealModalProps {
    onClose: () => void;
}

const CreateDealModal = ({ onClose }: CreateDealModalProps) => {
    const [name, setName] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [checkSize, setCheckSize] = useState('');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createDeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            name,
            company_url: companyUrl,
            check_size: Number(checkSize),
            stage: 'Sourced',
            status: 'active'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-xl font-bold mb-4">New Deal</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input className="border w-full p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL</label>
                        <input className="border w-full p-2 rounded" value={companyUrl} onChange={e => setCompanyUrl(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Check Size ($M)</label>
                        <input className="border w-full p-2 rounded" type="number" step="0.1" value={checkSize} onChange={e => setCheckSize(e.target.value)} required />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDealModal;
