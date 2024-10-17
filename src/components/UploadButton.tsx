import React, { useRef, useState, useCallback } from 'react'

interface UploadButtonProps {
  onFileUpload: (file: File) => void
  disabled?: boolean
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size should be less than 1 MB')
        return
      }
      if (file.name.endsWith('.sqlite') || file.name.endsWith('.csv')) {
        setFileName(file.name)
        onFileUpload(file)
      } else {
        alert('Please select a valid .sqlite or .csv file')
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClick = () => {
    triggerFileInput()
  }

  const uploadDatabase = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(process.env.POSTGRES_URL + '/upload-file', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.uuid
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }, [])

  return (
    <div className='fixed top-4 right-4 z-50'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        name='file'
        accept='.sqlite,.csv'
        className='hidden'
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {fileName ? (disabled ? `Uploading: ${fileName}` : `Uploaded: ${fileName}`) : 'Upload SQLite or CSV'}
      </button>
    </div>
  )
}

export default UploadButton
