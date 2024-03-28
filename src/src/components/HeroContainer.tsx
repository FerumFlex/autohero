import { useContext } from "react";
import { Flex, LoadingOverlay, Box, Image, Table, Progress, Paper, Button } from "@mantine/core"
import TooltipHelp from "./TooltipHelp"
import { HeroStoreContext } from "@/store/context";
import { observer } from "mobx-react";
import { IconAlertTriangle } from "@tabler/icons-react";
import avatar from "@/assets/images/avatar.png";

export const HeroContainer = observer(() => {
  const heroStore = useContext(HeroStoreContext);

  const onDeleteHero = () => {
    if (!confirm("Are you sure you want to delete your hero?")) {
      return;
    }
    heroStore.clearHero();
  };

  let percent = heroStore.isReady ? (heroStore.level - heroStore.levelInt) * 100 : 0;
  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={!heroStore.isReady}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        <Table>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Flex align={"center"} justify={"center"}>
                  <Image radius="md" src={avatar} h="200" w="auto" alt={"Hero"} />
                </Flex>
                {heroStore.isReady && (
                  <Progress m={20}
                    value={percent} size="lg" transitionDuration={200}
                    title={`Level ${heroStore.levelInt + 1} - ${percent.toFixed(2)}%`}
                  />
                )}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Flex align={"center"}>
                  <TooltipHelp help="Level of the hero" />
                  Level
                </Flex>
              </Table.Td>
              <Table.Td>
                {heroStore.isReady ? heroStore.levelInt : "Loading..."}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Flex align={"center"}>
                  <TooltipHelp help="Current attack" />
                  Attack
                </Flex>
              </Table.Td>
              <Table.Td>
                {heroStore.isReady ? heroStore.attack : "Loading..."}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Flex align={"center"}>
                  <TooltipHelp help="CUrrent defense" />
                  Defense
                </Flex>
              </Table.Td>
              <Table.Td>
                {heroStore.isReady ? heroStore.defense : "Loading..."}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>
                <Flex align={"center"}>
                  <TooltipHelp help="Current/max hit points" />
                  Hitpoints
                </Flex>
              </Table.Td>
              <Table.Td>
                {heroStore.isReady ? `${heroStore.hitpoints}/${heroStore.maxHitpoints}` : "Loading..."}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Paper mt={50}>
          <Button
            leftSection={<IconAlertTriangle />}
            rightSection={<IconAlertTriangle />}
            onClick={onDeleteHero} color="red">
            Delete Hero
          </Button>
        </Paper>
      </Box>
    </>
  )
});
