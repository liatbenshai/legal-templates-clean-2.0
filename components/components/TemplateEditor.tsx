'use client'

import { useState } from 'react'
import { Copy, Download, Wand2 } from 'lucide-react'

interface TemplateEditorProps {
  initialContent?: string
  onImprove?: (text: string) => Promise<string>
}

export default function TemplateEditor({ initialContent = '', onImprove }: TemplateEditorProps) {
  const [inputText, setInputText] = useState(initialContent)
  const [outputText, setOutputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImprove = async () => {
    if (!inputText.trim()) {
      alert('אנא הזן טקסט לשיפור')
      return
    }

    setIsProcessing(true)

    try {
      if (onImprove) {
        const improved = await onImprove(inputText)
        setOutputText(improved)
      } else {
        // Default mock improvement
        setTimeout(() => {
          setOutputText(`${inputText}\n\n[טקסט משופר]`)
          setIsProcessing(false)
        }, 2000)
        return
      }
    } catch (error) {
      console.error('Error improving text:', error)
      alert('שגיאה בשיפור הטקסט')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    alert('הטקסט הועתק ללוח')
  }

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'improved-text.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">טקסט מקורי</h3>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="הזן או הדבק טקסט כאן..."
          className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <button
          onClick={handleImprove}
          disabled={isProcessing || !inputText.trim()}
          className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              מעבד...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              שפר טקסט
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">טקסט משופר</h3>
          {outputText && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                title="העתק"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition"
                title="הורד"
              >
                <Download size={20} />
              </button>
            </div>
          )}
        </div>
        {outputText ? (
          <div className="h-96 overflow-y-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap">
            {outputText}
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <Wand2 size={48} className="mx-auto mb-4 opacity-30" />
              <p>הטקסט המשופר יופיע כאן</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

