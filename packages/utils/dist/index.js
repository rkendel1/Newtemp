// Generic utility functions
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
// Export other modules
export * from './styles';
export * from './config';
export * from './stripe';
