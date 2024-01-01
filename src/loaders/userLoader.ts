import { User } from ".prisma/client";
import DataLoader from "dataloader";
import { prisma } from "..";

type BatchUser = (ids: number[]) => Promise<User[]>


// make 1 request to get all ids
const batchUsers: BatchUser = async (idsArray) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: idsArray
      }
    }
  });

  const userMap: { [key: string]: User} = {};

  users.forEach((user) => {
    userMap[user.id] = user
  });

  return idsArray.map((id) => userMap[id]);
}

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers);
