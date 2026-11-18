import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type Props = {
  src: string | null
  alt?: string
  onClose: () => void
}

const ImageViewer = ({ src, alt = "Image", onClose }: Props) => (
  <Dialog open={src !== null} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="flex max-h-[92vh] w-auto max-w-[95vw] items-center justify-center overflow-auto p-2 sm:max-w-[90vw]">
      <DialogTitle className="sr-only">{alt}</DialogTitle>
      {src && (
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] max-w-full rounded-md object-contain"
        />
      )}
    </DialogContent>
  </Dialog>
)

export default ImageViewer
