import { createContext, useState, useContext } from 'react';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
    const [activeItem, setActiveItem] = useState(null);

    return (
        <ContentContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </ContentContext.Provider>
    );
}

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) return { activeItem: null, setActiveItem: () => {} };
    return context;
};