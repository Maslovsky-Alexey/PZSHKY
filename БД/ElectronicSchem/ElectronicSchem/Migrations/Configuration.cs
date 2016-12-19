namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ElectronicSchem.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "ElectronicSchem.Models.ApplicationDbContext";
        }

        protected override void Seed(ElectronicSchem.Models.ApplicationDbContext context)
        {
              //context.Roles.AddOrUpdate(
              //  p => p.Name,
              //  new Microsoft.AspNet.Identity.EntityFramework.IdentityRole { Name = "Admin" },
              //  new Microsoft.AspNet.Identity.EntityFramework.IdentityRole { Name = "User" }
              //);

        }
    }
}
