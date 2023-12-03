import { useCompanyStore } from '../../store/useCompanyStore';

const Sidebar = () => {
    const { positions, selectedPosition, selectPosition } = useCompanyStore();

    if (positions.length === 0) {
        return (
            <div>loading...</div>
        ) 
    }

    return (
        <div className='w-full'>
            <div className='mt-10 mx-auto'>
                <div className='flex flex-col mr-4 pl-0'>
                    {positions.map((position) => (
                        <div 
                            key={position.id} 
                            className={`rounded-r my-2 cursor-pointer ${position.id == selectedPosition?.id && 'bg-green-100 border border-l-8 border-l-green-300'}`}
                            onClick={() => selectPosition(position)}
                        >
                            <div className='px-4 py-4 sm:px-6'>
                                <h3 className={`text-lg leading-6 font-medium ${position.id == selectedPosition?.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {position.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar