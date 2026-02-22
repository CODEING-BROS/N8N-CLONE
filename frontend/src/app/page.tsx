import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'

const Page = () => {
  return (
    <div className={cn('text-red-500 text-5xl')}>
      HELLO
      <Button>
        CLICK ME
      </Button>
    </div>
  )
}

export default Page
