import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Deal {
    id?: number;
    name: string;
    company_url?: string;
    stage: 'Sourced' | 'Screen' | 'Diligence' | 'IC' | 'Invested' | 'Passed';
    check_size?: number;
    round?: string;
    status: string;
    owner_id?: number;
    created_at?: string;
}

export const getDeals = async () => {
    const res = await api.get<Deal[]>('/deals');
    return res.data;
};

export const updateDeal = async (id: number, deal: Partial<Deal>) => {
    const res = await api.patch<Deal>(`/deals/${id}`, deal);
    return res.data;
};

export const createDeal = async (deal: Deal) => {
    const res = await api.post<Deal>('/deals', deal);
    return res.data;
};

export interface Memo {
    id: number;
    deal_id: number;
    content: string; // JSON string of sections
    updated_at: string;
}

export interface MemoVersion {
    id: number;
    memo_id: number;
    content: string;
    created_at: string;
    created_by: number;
}

export const getMemo = async (dealId: number) => {
    try {
        const res = await api.get<Memo | null>(`/memos/${dealId}`);
        return res.data;
    } catch (err) {
        return null; // Handle 404 or empty
    }
};

export const saveMemo = async (dealId: number, content: any) => {
    const res = await api.post(`/memos/${dealId}`, content);
    return res.data;
};

export const getMemoHistory = async (dealId: number) => {
    const res = await api.get<MemoVersion[]>(`/memos/${dealId}/history`);
    return res.data;
};

export const getDeal = async (id: number) => {
    // const res = await api.get<Deal>(`/deals/${id}`); 
    // Fallback to list filtering for now as implemented in backend
    return (await getDeals()).find(d => d.id === id);
};

export interface Activity {
    id: number;
    deal_id: number;
    user_id: number;
    type: string;
    description: string;
    timestamp: string;
}

export const getActivities = async (dealId: number) => {
    const res = await api.get<Activity[]>(`/deals/${dealId}/activities`);
    return res.data;
};
