import { z } from 'zod';
import { createTRPCRouter, preniumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';
import { google } from '@ai-sdk/google';
import { generateText} from 'ai';
import { TRPCError } from '@trpc/server';

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


  testAi: preniumProcedure.mutation( async () => {
    throw new TRPCError({ code: 'NOT_IMPLEMENTED', message: 'This endpoint is not implemented yet.' });
    
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true , message: "AI execution triggered!"};
  }),


  getWorkflows: preniumProcedure.query(() => {
      return prisma.workflow.findMany({});
    }),

  createWorkflow: preniumProcedure.mutation( async () => {
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