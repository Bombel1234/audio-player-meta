import { PlayCircle, Menu, ListMusic } from 'lucide-react';

export default function ToolBarTop() {
    return (
        <div className='flex justify-between'>
            <Menu
                size={50}
            />
            <ListMusic
                size={50}
            />
        </div>
    )
}