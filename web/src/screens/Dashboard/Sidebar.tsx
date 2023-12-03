import { useCompanyStore } from '../../store/useCompanyStore'
import { Position } from '../../types';

interface SidebarProps {
    positions: Position[];
    selectedPositionId: string;
    setSelectedPositionId: (id: string) => void;
}

const Sidebar = ({ positions, selectedPositionId, setSelectedPositionId }: SidebarProps) => {

  return (
    <div className='w-full'>
        <div className='mt-10 mx-auto'>
            <div className='flex flex-col mr-4 pl-0'>
                {positions.map((position) => (
                    <div key={position.id} className={`rounded-r my-2 cursor-pointer ${position.id == selectedPositionId && 'bg-green-100 border border-l-8 border-l-green-300'}`}
                    onClick={() => setSelectedPositionId(position.id)}
                    >
                        <div className='px-4 py-4 sm:px-6'>
                            <h3 className={`text-lg leading-6 font-medium ${position.id == selectedPositionId ? 'text-gray-900' : 'text-gray-600'}`}>{position.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Sidebar