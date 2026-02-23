import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
  // getUsers: protectedProcedure.query(({ctx}) => 
  //   {
  //     console.log({userId: ctx.auth.user.id});

  //     return prisma.user.findMany({
  //       where : {
  //         id: ctx.auth.user.id,
  //       },
  //     });
  //   }),

  getWorkflows: protectedProcedure.query(() => {
      return prisma.workflow.findMany({});
    }),

  createWorkflow: protectedProcedure.mutation( async () => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: "1234@gmail.com",
        },
    });

    return { success: true , message: "Workflow creation triggered!"};

  })

});
// export type definition of API
export type AppRouter = typeof appRouter;