import React from 'react'

const Sidebar = () => {
    const [positions, ] = React.useState(['Software Engineer', 'Backend Developer'])
    const [selectedPositionIndex, setSelectedPositionIndex] = React.useState<number>(0)

  return (
    <div className='w-full'>
        <div className='mt-10 mx-auto'>
            <div className='flex flex-col mr-4 pl-0'>
                {positions.map((position, index) => (
                    <div key={index} className={`rounded-r my-2 cursor-pointer ${index == selectedPositionIndex && 'bg-green-100 border border-l-8 border-l-green-300'}`}
                    onClick={() => setSelectedPositionIndex(index)}
                    >
                        <div className='px-4 py-4 sm:px-6'>
                            <h3 className={`text-lg leading-6 font-medium ${index == selectedPositionIndex ? 'text-gray-900' : 'text-gray-600'}`}>{position}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Sidebar