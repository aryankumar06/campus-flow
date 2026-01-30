const globalStore =
  (globalThis as any).__mockdb ||
  ((globalThis as any).__mockdb = (function init() {
    const { hashSync } = require("bcryptjs");
    const now = new Date();
    const studentId = `${"usr"}_student_demo`;
    const organizerId = `${"usr"}_organizer_demo`;
    const demoUsers = [
      {
        id: studentId,
        role: "STUDENT",
        name: "Demo Student",
        email: "student@example.com",
        password: hashSync("Password123!", 10),
        department: "Computer Science",
        year: "3",
        collegeId: "STU1001",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: organizerId,
        role: "ORGANIZER",
        name: "Demo Organizer",
        email: "organizer@example.com",
        password: hashSync("Password123!", 10),
        department: "Events",
        year: null,
        collegeId: "ORG2001",
        createdAt: now,
        updatedAt: now,
      },
    ];
    const demoEvents = [
      {
        id: `${"evt"}_tech_talk`,
        title: "Tech Talk: Modern Web",
        description: "Learn about modern web tooling and best practices.",
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // +3 days
        venue: "Auditorium A",
        capacity: 100,
        category: "TECHNICAL",
        imageUrl: null,
        deadline: null,
        organizerId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `${"evt"}_music_fest`,
        title: "Annual Music Fest",
        description: "Cultural night with live performances.",
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // +10 days
        venue: "Main Ground",
        capacity: 500,
        category: "CULTURAL",
        imageUrl: null,
        deadline: null,
        organizerId,
        createdAt: now,
        updatedAt: now,
      },
    ];
    return {
      users: demoUsers,
      events: demoEvents,
      registrations: [] as any[],
    };
  })());

const genId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;

const likeInsensitive = (s: string, q: string) =>
  s?.toLowerCase().includes(q?.toLowerCase());

export function createMockDb() {
  const getEventCount = (eventId: string) =>
    globalStore.registrations.filter((r: any) => r.eventId === eventId && !r.canceledAt).length;

  const withEventIncludes = (event: any, include: any) => {
    if (!event) return null;
    const result = { ...event };
    if (include?.organizer?.select?.name) {
      const organizer = globalStore.users.find((u: any) => u.id === event.organizerId);
      result.organizer = organizer ? { name: organizer.name } : null;
    }
    if (include?._count?.select?.registrations) {
      result._count = { registrations: getEventCount(event.id) };
    }
    return result;
  };

  const withRegistrationIncludes = (registration: any, include: any) => {
    if (!registration) return null;
    const result = { ...registration };
    if (include?.event) {
      result.event = globalStore.events.find((e: any) => e.id === registration.eventId) || null;
    }
    if (include?.user) {
      result.user = globalStore.users.find((u: any) => u.id === registration.userId) || null;
    }
    return result;
  };

  return {
    user: {
      findUnique: async ({ where }: any) => {
        console.log("[MOCK_DB] user.findUnique", where);
        if (where?.email) {
          return globalStore.users.find((u: any) => u.email === where.email) || null;
        }
        if (where?.id) {
          return globalStore.users.find((u: any) => u.id === where.id) || null;
        }
        return null;
      },
      create: async ({ data }: any) => {
        console.log("[MOCK_DB] user.create", data);
        if (globalStore.users.some((u: any) => u.email === data.email)) {
          throw new Error("Unique constraint failed on fields: (`email`)");
        }
        const now = new Date();
        const user = {
          id: genId("usr"),
          role: data.role || "STUDENT",
          name: data.name,
          email: data.email,
          password: data.password,
          department: data.department || null,
          year: data.year || null,
          collegeId: data.collegeId || null,
          createdAt: now,
          updatedAt: now,
        };
        globalStore.users.push(user);
        return user;
      },
    },
    event: {
      findUnique: async ({ where, include }: any) => {
        console.log("[MOCK_DB] event.findUnique", where);
        const event = globalStore.events.find((e: any) => e.id === where.id) || null;
        return withEventIncludes(event, include);
      },
      findMany: async ({ where = {}, orderBy, include }: any = {}) => {
        console.log("[MOCK_DB] event.findMany", where);
        let events = [...globalStore.events];
        if (where?.category) {
          events = events.filter((e) => e.category === where.category);
        }
        if (where?.dateTime?.gte) {
          const dt = new Date(where.dateTime.gte);
          events = events.filter((e) => new Date(e.dateTime) >= dt);
        }
        if (where?.OR && Array.isArray(where.OR)) {
          events = events.filter((e) =>
            where.OR.some((cond: any) => {
              const titleCond = cond.title?.contains;
              const descCond = cond.description?.contains;
              return (
                (titleCond && likeInsensitive(e.title, titleCond)) ||
                (descCond && likeInsensitive(e.description, descCond))
              );
            })
          );
        }
        if (where?.organizerId) {
          events = events.filter((e) => e.organizerId === where.organizerId);
        }
        if (orderBy?.dateTime === "asc") {
          events.sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime));
        } else if (orderBy?.dateTime === "desc") {
          events.sort((a, b) => +new Date(b.dateTime) - +new Date(a.dateTime));
        }
        return events.map((e) => withEventIncludes(e, include));
      },
      create: async ({ data }: any) => {
        const now = new Date();
        const event = {
          id: genId("evt"),
          title: data.title,
          description: data.description || "",
          dateTime: new Date(data.dateTime),
          venue: data.venue,
          capacity: Number(data.capacity),
          category: data.category,
          imageUrl: data.imageUrl || null,
          deadline: data.deadline ? new Date(data.deadline) : null,
          organizerId: data.organizerId,
          createdAt: now,
          updatedAt: now,
        };
        globalStore.events.push(event);
        return event;
      },
    },
    registration: {
      findUnique: async ({ where, include }: any) => {
        console.log("[MOCK_DB] registration.findUnique", where);
        let reg: any = null;
        if (where?.qrCode) {
          reg = globalStore.registrations.find((r: any) => r.qrCode === where.qrCode) || null;
        } else if (where?.userId_eventId) {
          const { userId, eventId } = where.userId_eventId;
          reg =
            globalStore.registrations.find(
              (r: any) => r.userId === userId && r.eventId === eventId
            ) || null;
        } else if (where?.id) {
          reg = globalStore.registrations.find((r: any) => r.id === where.id) || null;
        }
        return withRegistrationIncludes(reg, include);
      },
      findMany: async ({ where, include, orderBy }: any) => {
        console.log("[MOCK_DB] registration.findMany", where);
        let results = [...globalStore.registrations];
        if (where?.userId) {
          results = results.filter((r) => r.userId === where.userId);
        }
        if (orderBy?.createdAt === "desc") {
          results.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        }
        return results.map((r) => withRegistrationIncludes(r, include));
      },
      create: async ({ data, include }: any) => {
        console.log("[MOCK_DB] registration.create", data);
        if (globalStore.registrations.some((r: any) => r.qrCode === data.qrCode)) {
          throw new Error("Unique constraint failed on fields: (`qrCode`)");
        }
        if (
          globalStore.registrations.some(
            (r: any) => r.userId === data.userId && r.eventId === data.eventId
          )
        ) {
          throw new Error("Unique constraint failed on fields: (`userId`,`eventId`)");
        }
        const now = new Date();
        const reg = {
          id: genId("reg"),
          userId: data.userId,
          eventId: data.eventId,
          qrCode: data.qrCode,
          attended: false,
          createdAt: now,
        };
        globalStore.registrations.push(reg);
        return withRegistrationIncludes(reg, include);
      },
      update: async ({ where, data }: any) => {
        console.log("[MOCK_DB] registration.update", { where, data });
        const idx = globalStore.registrations.findIndex((r: any) => r.id === where.id);
        if (idx === -1) throw new Error("Registration not found");
        globalStore.registrations[idx] = {
          ...globalStore.registrations[idx],
          ...data,
        };
        return globalStore.registrations[idx];
      },
    },
  };
}
