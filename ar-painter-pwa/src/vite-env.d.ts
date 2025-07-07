/// <reference types="vite/client" />

// Extend A-Frame's JSX.IntrinsicElements for TypeScript support with React
// This allows using A-Frame elements like <a-scene>, <a-box> directly in TSX
// We will add more specific A-Frame components here as we use them.
declare namespace JSX {
    interface IntrinsicElements {
        'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-box': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-cursor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        'a-plane': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { [key: string]: any };
        // Add other A-Frame elements here as needed, e.g., a-cylinder, a-sphere, etc.
    }
}
