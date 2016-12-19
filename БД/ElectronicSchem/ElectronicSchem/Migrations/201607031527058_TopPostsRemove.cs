namespace ElectronicSchem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TopPostsRemove : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.TopPostModels");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TopPostModels",
                c => new
                    {
                        ID = c.Long(nullable: false, identity: true),
                        PostID = c.Long(nullable: false),
                        Rating = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
        }
    }
}
