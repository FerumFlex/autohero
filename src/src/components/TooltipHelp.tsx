import { Tooltip } from "@mantine/core"
import { IconHelp } from '@tabler/icons-react';

interface TooltipHelpProps {
  help: string
}

export default function TooltipHelp(props: TooltipHelpProps) {
  return (
    <Tooltip mr={10} label={props.help}>
      <IconHelp size={16} />
    </Tooltip>
  )
}