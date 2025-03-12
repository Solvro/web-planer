import { prisma } from "../lib/db";
import { strings } from "../utils/strings";

export const DepartmentsController = {
  getDepartments: async () => {
    try {
      const departments = await prisma.departments.findMany({});
      return departments;
    } catch (error) {
      console.log("🚀 ~ getDepartments: ~ error:", error);
      return {
        data: [],
        message: strings.response.failed,
      };
    }
  },
  getDepartmentById: async (id: string) => {
    try {
      const department = await prisma.departments.findUnique({
        where: {
          id,
        },
      });
      return department;
    } catch (error) {
      console.log("🚀 ~ getDepartmentById: ~ error:", error);
      return {
        data: {},
        message: strings.response.failed,
      };
    }
  },
};
