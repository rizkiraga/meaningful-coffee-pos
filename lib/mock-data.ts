import { Product, User } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Americano',
        price: 25000,
        category: 'coffee',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
    },
    {
        id: '2',
        name: 'Cafe Latte',
        price: 30000,
        category: 'coffee',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    },
    {
        id: '3',
        name: 'Cappuccino',
        price: 30000,
        category: 'coffee',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    },
    {
        id: '4',
        name: 'Matcha Latte',
        price: 32000,
        category: 'non-coffee',
        image: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=400&h=400&fit=crop',
    },
    {
        id: '5',
        name: 'Chocolate',
        price: 28000,
        category: 'non-coffee',
        image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop',
    },
    {
        id: '6',
        name: 'Croissant',
        price: 20000,
        category: 'snack',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
    },
];

export const MOCK_USER: User = {
    id: 'user-1',
    name: 'Cashier One',
    role: 'cashier',
};
