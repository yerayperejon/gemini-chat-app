import React, { useState } from 'react';
import { editImageWithPrompt } from '../services/geminiService';
import { PhotoIcon, SparklesIcon } from './Icons';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null); // Clear previous edit on new image upload
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!originalImageFile || !prompt) {
      setError("Por favor, sube una imagen y escribe una instrucción.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(originalImageFile);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const newImageBase64 = await editImageWithPrompt(base64String, originalImageFile.type, prompt);
        setEditedImage(`data:${originalImageFile.type};base64,${newImageBase64}`);
      };
    } catch (err: any) {
      setError(err.message || "Ha ocurrido un error al generar la imagen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
            <SparklesIcon className="w-8 h-8 mr-3 text-rose-900" />
            <h2 className="text-3xl font-bold text-gray-800">Editor de Imágenes con IA</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">1. Sube tu imagen</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-rose-800 hover:text-rose-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500">
                                <span>Selecciona un archivo</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <p className="pl-1">o arrástralo aquí</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">2. Escribe qué quieres cambiar</label>
                <textarea
                    id="prompt"
                    rows={3}
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md text-slate-900 bg-white"
                    placeholder="Ej: Añade un filtro retro, cambia el fondo a una playa..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                    onClick={generateImage}
                    disabled={isLoading || !originalImage || !prompt}
                    className="mt-4 w-full bg-rose-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-rose-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Generando...' : 'Generar Imagen'}
                </button>
            </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Original</h3>
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {originalImage ? <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain rounded-lg"/> : <span className="text-gray-500">Sube una imagen para empezar</span>}
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Editada</h3>
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {isLoading && <span className="text-gray-500">Procesando...</span>}
                    {editedImage && !isLoading && <img src={editedImage} alt="Edited" className="max-h-full max-w-full object-contain rounded-lg"/>}
                    {!editedImage && !isLoading && <span className="text-gray-500">Aquí aparecerá tu imagen editada</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
