using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using ElectronicSchem.Models;
using System.Data.Entity.Infrastructure;
using System.Text;
using System.Xml;

namespace ElectronicSchem.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string PhotoLink { get; set; }
        public string Language { get; set; }
        public virtual ICollection<ElectronicSchemModels.Medal> Medals { get; set; }
        public bool isMuted { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("ElectronicSchecmDataBase", throwIfV1Schema: false)
        {
             // namespace for the EdmxWriter class

            
                using (var writer = new XmlTextWriter(@"d:\Model.edmx", Encoding.Default))
                {
                    EdmxWriter.WriteEdmx(this, writer);
                }
            
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<ElectronicSchemModels.Posts.PostModel> Posts { get; set; }

        public DbSet<ElectronicSchemModels.Comments.CommentModel> Comments { get; set; }

        public DbSet<ElectronicSchemModels.Components.ComponentModel> Components { get; set; }

        public DbSet<ElectronicSchemModels.Components.InputModel> Inputs { get; set; }

        public DbSet<ElectronicSchemModels.Components.PropertyModel> Proprties { get; set; }

        public DbSet<ElectronicSchemModels.Components.PropertyItemsModel> PropertiesElements { get; set; }

        public DbSet<ElectronicSchemModels.Schems.WireModel> Wires { get; set; }

        public DbSet<ElectronicSchemModels.Posts.TagModel> Tags { get; set; }

        public DbSet<ElectronicSchemModels.Posts.LikeModel> Likes { get; set; }

        public DbSet<ElectronicSchemModels.Medal> Medals { get; set; }

        public DbSet<ElectronicSchemModels.Posts.CategoryModel> Categories { get; set; }
    }
}